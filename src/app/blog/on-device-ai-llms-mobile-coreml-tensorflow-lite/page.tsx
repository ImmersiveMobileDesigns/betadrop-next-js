import type { Metadata } from "next";
import Link from "next/link";
import BlogLayout from "@/components/blog/BlogLayout";
import { getBlogPost } from "@/lib/blog";

const post = getBlogPost("on-device-ai-llms-mobile-coreml-tensorflow-lite")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.metaDescription,
  keywords: [post.primaryKeyword, ...post.secondaryKeywords],
  authors: [{ name: post.author }],
  openGraph: {
    title: post.title,
    description: post.metaDescription,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author],
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.metaDescription,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
  },
};

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.h1,
  description: post.metaDescription,
  author: {
    "@type": "Organization",
    name: post.author,
  },
  publisher: {
    "@type": "Organization",
    name: "BetaDrop",
    logo: {
      "@type": "ImageObject",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    },
  },
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the primary benefits of running LLMs on-device for mobile apps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The main benefits include significantly reduced latency due to no network calls, enhanced user privacy as data stays on the device, offline functionality, lower operational costs by offloading cloud inference, and an overall improved user experience.",
      },
    },
    {
      "@type": "Question",
      name: "How do I convert a large LLM into a format suitable for Core ML or TensorFlow Lite?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For Core ML, you typically use the 'coremltools' Python package to convert models from frameworks like PyTorch or TensorFlow into the '.mlmodel' format. For TensorFlow Lite, you use the TensorFlow Lite Converter to convert TensorFlow models into the '.tflite' format, often applying optimizations like quantization during conversion.",
      },
    },
    {
      "@type": "Question",
      name: "What are some key challenges when implementing on-device LLMs and how can they be addressed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Key challenges include large model sizes, high computational demands, and battery consumption. These can be addressed through model optimization techniques like quantization, pruning, and distillation, leveraging hardware acceleration (Neural Engine, NPUs/GPUs), careful memory management, and considering dynamic model loading for smaller initial app sizes.",
      },
    },
  ],
};

export default function BlogPostPage() {
  const articleJson = JSON.stringify(articleStructuredData);
  const faqJson = JSON.stringify(faqStructuredData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJson }}
      />

      <BlogLayout post={post}>
        <p>
          In 2026, the demand for intelligent mobile applications is soaring,
          but relying solely on cloud-based AI for every interaction can
          introduce latency, privacy concerns, and significant operational
          costs. This is where <strong>on-device AI</strong> comes into its own.
          Running Large Language Models (LLMs) directly on smartphones and
          tablets is no longer a futuristic dream — it&apos;s a practical
          reality. This guide walks you through implementing local LLMs on both
          iOS and Android using Apple&apos;s Core ML and Google&apos;s
          TensorFlow Lite.
        </p>

        <h3>The Power of On-Device AI for Mobile Developers</h3>
        <p>
          The shift towards <strong>on-device AI</strong> brings a multitude of
          benefits that directly impact user experience and application
          architecture:
        </p>
        <ul>
          <li>
            <strong>Reduced Latency:</strong> No network calls mean instant
            inference — text summarization, code generation, and NLU can happen
            in milliseconds.
          </li>
          <li>
            <strong>Enhanced Privacy:</strong> User data stays on the device,
            eliminating the need to transmit sensitive information to external
            servers.
          </li>
          <li>
            <strong>Offline Functionality:</strong> Apps can perform complex AI
            tasks without an internet connection.
          </li>
          <li>
            <strong>Cost Savings:</strong> Offloading inference from cloud
            servers to the device significantly reduces API usage fees.
          </li>
          <li>
            <strong>Improved UX:</strong> Faster responses and consistent
            offline functionality foster greater user engagement.
          </li>
        </ul>
        <p>
          However, bringing LLMs to mobile devices is not without challenges.
          Model size, computational requirements, and battery consumption
          require careful optimization.
        </p>

        <h3>Core ML for iOS: Bringing LLMs to Apple Devices</h3>
        <p>
          Apple&apos;s <strong>Core ML</strong> framework is the backbone for
          integrating machine learning models into iOS, macOS, watchOS, and tvOS
          apps. It provides a unified API for leveraging the device&apos;s
          Neural Engine, GPU, and CPU for efficient on-device inference. To run{" "}
          <strong>local LLMs on mobile</strong> with Core ML, convert your
          trained model into the <code>.mlmodel</code> format using the{" "}
          <code>coremltools</code> Python package.
        </p>

        <h3>Core ML Example (Swift)</h3>
        <p>
          Here is a simplified Swift example demonstrating how to load and use a
          quantized LLM model:
        </p>
        <pre>
          <code>{`import CoreML

func generateText(prompt: String) async throws -> String {
    let configuration = MLModelConfiguration()
    configuration.computeUnits = .all // Use Neural Engine + GPU + CPU
    
    let model = try MyLocalLLM(configuration: configuration)
    let input = MyLocalLLMInput(inputText: prompt)
    let prediction = try await model.prediction(input: input)
    return prediction.generatedText
}

// Usage
Task {
    let result = try await generateText(prompt: "Explain on-device AI:")
    print(result)
}`}</code>
        </pre>
        <p>
          For more details, refer to the{" "}
          <a
            href="https://developer.apple.com/documentation/coreml"
            target="_blank"
            rel="noopener noreferrer"
          >
            official Core ML documentation
          </a>
          .
        </p>

        <h3>TensorFlow Lite for Android: Edge AI on Android</h3>
        <p>
          For Android developers, <strong>TensorFlow Lite</strong> is
          Google&apos;s solution for deploying ML models on mobile and embedded
          devices. Convert your TensorFlow model to the <code>.tflite</code>{" "}
          format using the TensorFlow Lite Converter, applying quantization to
          shrink model size and speed up inference.
        </p>

        <h3>TensorFlow Lite Example (Kotlin)</h3>
        <p>
          Here is how to load and run inference with a{" "}
          <code>quantized_llm.tflite</code> model in your Android app:
        </p>
        <pre>
          <code>{`import org.tensorflow.lite.Interpreter
import java.nio.ByteBuffer
import java.nio.ByteOrder

fun loadModel(context: Context): ByteBuffer {
    val fd = context.assets.openFd("quantized_llm.tflite")
    val stream = FileInputStream(fd.fileDescriptor)
    return stream.channel.map(
        FileChannel.MapMode.READ_ONLY,
        fd.startOffset,
        fd.declaredLength
    )
}

fun runInference(context: Context, inputTokens: IntArray): IntArray {
    val interpreter = Interpreter(loadModel(context))
    val inputBuf = ByteBuffer.allocateDirect(inputTokens.size * 4)
        .apply { order(ByteOrder.nativeOrder()) }
    inputTokens.forEach { inputBuf.putInt(it) }

    val outputBuf = ByteBuffer.allocateDirect(100 * 4)
        .apply { order(ByteOrder.nativeOrder()) }
    interpreter.run(inputBuf, outputBuf)

    outputBuf.rewind()
    return IntArray(100) { outputBuf.getInt() }
}`}</code>
        </pre>
        <p>
          For comprehensive guidance, consult the{" "}
          <a
            href="https://www.tensorflow.org/lite"
            target="_blank"
            rel="noopener noreferrer"
          >
            TensorFlow Lite documentation
          </a>
          .
        </p>

        <h3>Optimization Best Practices</h3>
        <p>
          Optimizing <strong>on-device AI</strong> models for mobile requires a
          strategic approach:
        </p>
        <ul>
          <li>
            <strong>Model Quantization:</strong> Reduce weight precision
            (float32 → int8) to cut model size and inference time with minimal
            accuracy loss.
          </li>
          <li>
            <strong>Pruning &amp; Distillation:</strong> Pruning removes
            unimportant network connections; distillation trains a smaller
            student model to mimic a larger teacher model.
          </li>
          <li>
            <strong>Hardware Acceleration:</strong> Configure Core ML and
            TensorFlow Lite to use the Neural Engine (iOS) and NPU/GPU (Android)
            for maximum efficiency.
          </li>
          <li>
            <strong>Dynamic Model Loading:</strong> Download models post-install
            to keep initial app size small and allow seamless model updates.
          </li>
          <li>
            <strong>Benchmark &amp; Profile:</strong> Use Xcode Instruments and
            Android Studio Profiler to identify bottlenecks across target
            devices.
          </li>
        </ul>

        <h3>The Future is Local</h3>
        <p>
          The rise of <strong>local LLMs on mobile</strong> is fundamentally
          changing how we build intelligent applications. By embracing{" "}
          <strong>on-device AI</strong> with Core ML and TensorFlow Lite,
          developers can create private, high-performing mobile experiences that
          stand out in a crowded market.
        </p>
        <p>
          As you build these advanced AI-powered apps, effective beta testing
          becomes paramount. Platforms like <a href="/">BetaDrop</a> simplify
          distributing your iOS IPA and Android APK beta builds, enabling you to
          gather real-world feedback across diverse hardware configurations
          before your public launch.
        </p>
      </BlogLayout>
    </>
  );
}
