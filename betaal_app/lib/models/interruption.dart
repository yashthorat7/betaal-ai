class Interruption {
  final int timeOffsetMin;
  final String type;
  final double intensity;
  final int durationSec;

  Interruption({
    required this.timeOffsetMin,
    required this.type,
    required this.intensity,
    required this.durationSec,
  });

  factory Interruption.fromJson(Map<String, dynamic> json) {
    return Interruption(
      timeOffsetMin: json['time_offset_min'] ?? 0,
      type: json['type'] ?? 'black_screen',
      intensity: (json['intensity'] ?? 0.5).toDouble(),
      durationSec: json['duration_sec'] ?? 10,
    );
  }
}
